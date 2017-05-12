from contextlib import contextmanager
from datetime import datetime

from constants import DB_PATH
from models import Module, Machine

import sqlite3


@contextmanager
def get_db_conn():
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        yield conn
    finally:
        if conn:
            conn.close()


def fetch_modules(machine_id):
    sql = """
    SELECT hierarchy_modules.id, hierarchy_modules.name, hierarchy_modules.label
    FROM
        hierarchy_machines_modules
        LEFT JOIN hierarchy_modules on hierarchy_machines_modules.module_id = hierarchy_modules.id
    WHERE machine_id = ?
    """
    with get_db_conn() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, (machine_id,))
        modules = [Module(id=row[0], name=row[1], label=row[2]) for row in cursor.fetchall()]
        cursor.close()
        return modules


def fetch_machines():
    sql = """
    SELECT id, name
    FROM hierarchy_machines
    """
    with get_db_conn() as conn:
        cursor = conn.cursor()
        cursor.execute(sql)
        machines = []
        for row in cursor:
            modules = fetch_modules(row[0])
            machine = Machine(id=row[0], name=row[1], modules=modules)
            machines.append(machine)
        cursor.close()
        return machines


def fetch_previous(machine_id, module_id, conn):
    sql = """
    SELECT value FROM sample_sampledata
    WHERE machine = ? AND module = ?
    LIMIT 1
    """
    cursor = conn.cursor()
    cursor.execute(sql, (machine_id, module_id))
    try:
        return cursor.fetchone()[0]
    except TypeError:
        return None
    finally:
        cursor.close()


def insert_data(datapoints):
    sql = """
    INSERT INTO sample_sampledata
    (created, value, machine, module)
    VALUES (?, ?, ?, ?)
    """
    with get_db_conn() as conn:
        for d in datapoints:
            cursor = conn.cursor()
            params = (datetime.now(), d.value, d.machine, d.module)
            cursor.execute(sql, params)
            cursor.close()
        conn.commit()
