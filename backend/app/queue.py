import os
from redis import Redis
from rq import Queue

# Prefer REDIS_URL, fallback to host/port
REDIS_URL = os.getenv("REDIS_URL")

if REDIS_URL:
    redis_conn = Redis.from_url(REDIS_URL)
else:
    REDIS_HOST = os.getenv("REDIS_HOST", "redis")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    redis_conn = Redis(host=REDIS_HOST, port=REDIS_PORT)

QUEUE_NAME = os.getenv("RQ_QUEUE_NAME", "compare-jobs")

queue = Queue(QUEUE_NAME, connection=redis_conn)
