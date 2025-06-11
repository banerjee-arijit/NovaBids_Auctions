-- Create a function to clean up ended auctions
CREATE OR REPLACE FUNCTION cleanup_ended_auctions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete auctions that have ended
  DELETE FROM auctions
  WHERE end_time < NOW()
  AND status = 'active';
END;
$$;

-- Create a trigger to automatically run the cleanup function
CREATE OR REPLACE FUNCTION trigger_cleanup_ended_auctions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the cleanup function
  PERFORM cleanup_ended_auctions();
  RETURN NEW;
END;
$$;

-- Create a trigger that runs every minute
CREATE OR REPLACE TRIGGER cleanup_ended_auctions_trigger
  AFTER INSERT OR UPDATE ON auctions
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_ended_auctions(); 