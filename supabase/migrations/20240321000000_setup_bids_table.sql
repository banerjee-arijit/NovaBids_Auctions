-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.bids
    DROP CONSTRAINT IF EXISTS bids_bidder_id_fkey;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anyone to read bids" ON public.bids;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own bids" ON public.bids;
DROP POLICY IF EXISTS "Allow users to update their own bids" ON public.bids;
DROP POLICY IF EXISTS "Allow users to delete their own bids" ON public.bids;

-- Create bids table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint explicitly
ALTER TABLE public.bids
    ADD CONSTRAINT bids_bidder_id_fkey
    FOREIGN KEY (bidder_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read bids
CREATE POLICY "Allow anyone to read bids"
    ON public.bids
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert their own bids
CREATE POLICY "Allow authenticated users to insert their own bids"
    ON public.bids
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > NOW()
        )
    );

-- Allow users to update their own bids
CREATE POLICY "Allow users to update their own bids"
    ON public.bids
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > NOW()
        )
    )
    WITH CHECK (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > NOW()
        )
    );

-- Allow users to delete their own bids
CREATE POLICY "Allow users to delete their own bids"
    ON public.bids
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM public.auctions
            WHERE id = auction_id
            AND status = 'active'
            AND end_time > NOW()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bids_auction_id_idx ON public.bids(auction_id);
CREATE INDEX IF NOT EXISTS bids_bidder_id_idx ON public.bids(bidder_id);
CREATE INDEX IF NOT EXISTS bids_created_at_idx ON public.bids(created_at);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_bids_updated_at ON public.bids;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON public.bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 