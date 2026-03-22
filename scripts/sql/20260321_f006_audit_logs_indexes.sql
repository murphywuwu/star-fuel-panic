-- F-006 T-0087
-- Accelerate anti-cheat and observability queries on audit logs.

CREATE INDEX IF NOT EXISTS idx_audit_logs_match_id
  ON audit_logs (match_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type
  ON audit_logs (event_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc
  ON audit_logs (created_at DESC);

-- Composite index for the common trace query pattern:
-- WHERE match_id = ? AND event_type = ? ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_audit_logs_match_event_created_desc
  ON audit_logs (match_id, event_type, created_at DESC);
