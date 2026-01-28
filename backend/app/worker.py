import os
import logging
from rq import Worker, Connection

from .queue import redis_conn


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

QUEUE = os.getenv("RQ_QUEUE_NAME", "compare-jobs")


if __name__ == "__main__":
    logging.info("Starting worker on queue=%s", QUEUE)

    with Connection(redis_conn):
        worker = Worker([QUEUE])
        worker.work(logging_level="INFO")
