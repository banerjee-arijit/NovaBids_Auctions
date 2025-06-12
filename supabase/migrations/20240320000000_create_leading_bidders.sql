-- Create leading_bidders table
CREATE TABLE IF NOT EXISTS leading_bidders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    bid_amount DECIMAL(10,2) NOT NULL,
    bidder_name TEXT NOT NULL,
    bidder_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(auction_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leading_bidders_auction_id ON leading_bidders(auction_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leading_bidders_updated_at
    BEFORE UPDATE ON leading_bidders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 