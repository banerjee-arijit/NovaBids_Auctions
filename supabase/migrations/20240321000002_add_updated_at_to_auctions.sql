-- ThisAdd updated_at column to auctions table
ALTER TABLE public.auctions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_auctions_updated_at ON public.auctions;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON public.auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 