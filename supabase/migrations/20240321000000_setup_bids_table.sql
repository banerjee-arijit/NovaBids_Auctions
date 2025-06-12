-- Drop existing table if it exists
DROP TABLE IF EXISTS public.bids CASCADE;

-- Create bids table
CREATE TABLE public.bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auction_id UUID NOT NULL,
    bidder_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(auction_id, bidder_id)
);

-- Add foreign key constraints
ALTER TABLE public.bids
    ADD CONSTRAINT bids_auction_id_fkey
    FOREIGN KEY (auction_id)
    REFERENCES public.auctions(id)
    ON DELETE CASCADE;

ALTER TABLE public.bids
    ADD CONSTRAINT bids_bidder_id_fkey
    FOREIGN KEY (bidder_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anyone to read bids" ON public.bids;
DROP POLICY IF EXISTS "Allow users to insert their own bids" ON public.bids;
DROP POLICY IF EXISTS "Allow users to update their own bids" ON public.bids;
DROP POLICY IF EXISTS "Allow users to delete their own bids" ON public.bids;

-- Create policies
-- Allow anyone to read bids
CREATE POLICY "Allow anyone to read bids"
    ON public.bids
    FOR SELECT
    USING (true);

-- Allow users to insert their own bids
CREATE POLICY "Allow users to insert their own bids"
    ON public.bids
    FOR INSERT
    WITH CHECK (
        auth.uid() = bidder_id
        AND EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > now()
        )
    );

-- Allow users to update their own bids
CREATE POLICY "Allow users to update their own bids"
    ON public.bids
    FOR UPDATE
    USING (
        auth.uid() = bidder_id
        AND EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > now()
        )
    )
    WITH CHECK (
        auth.uid() = bidder_id
        AND EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > now()
        )
    );

-- Allow users to delete their own bids
CREATE POLICY "Allow users to delete their own bids"
    ON public.bids
    FOR DELETE
    USING (
        auth.uid() = bidder_id
        AND EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > now()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bids_auction_id_idx ON public.bids(auction_id);
CREATE INDEX IF NOT EXISTS bids_bidder_id_idx ON public.bids(bidder_id);
CREATE INDEX IF NOT EXISTS bids_created_at_idx ON public.bids(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_bids_updated_at ON public.bids;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON public.bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 