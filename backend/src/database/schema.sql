-- Table for raw Deposit/Withdraw events
CREATE TABLE IF NOT EXISTS vaultbridge_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'deposit' or 'withdraw'
    tx_hash TEXT NOT NULL,
    log_index INTEGER NOT NULL,
    block_number INTEGER NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    sender TEXT,
    receiver TEXT,
    owner TEXT,
    assets NUMERIC NOT NULL,
    shares NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_asset ON vaultbridge_events(asset);
CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_event_type ON vaultbridge_events(event_type);
CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_event_timestamp ON vaultbridge_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_asset_type_time ON vaultbridge_events(asset, event_type, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_block_number ON vaultbridge_events(block_number);
CREATE INDEX IF NOT EXISTS idx_vaultbridge_events_tx_hash ON vaultbridge_events(tx_hash); 