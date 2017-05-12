from random import uniform, randint
import functions as fn
from models import Data


def get_uniform(previous, l=3, min=0, max=100):
    if previous:
        return uniform(previous - l if previous - l > min else min,
                       previous + l if previous + l < max else max)
    else:
        return uniform(min, max)


def gen_value_by_module(module_name, previous):
    if 'efficiency' in module_name:
        return get_uniform(previous, min=80)
    else:
        return randint(5, 10)


datapoints = []
machines = fn.fetch_machines()
with fn.get_db_conn() as conn:
    for machine in machines:
        for module in machine.modules:
            previous_value = fn.fetch_previous(machine.id, module.id, conn)
            datapoints.append(Data(
                machine=machine.id,
                module=module.id,
                value=gen_value_by_module(module.name, previous_value)
            ))

fn.insert_data(datapoints)
