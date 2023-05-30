import random
import subprocess
import time

from flask import Flask, request

app = Flask(__name__)

PROC = {}


def response(status: str, data=None, reason=None):
    if status == 'ok':
        return {
            'status': 'ok',
            'result': data
        }
    elif status == 'err':
        return {
            'status': 'err',
            'reason': str(reason)
        }


@app.route('/')
def main():
    return 'Websockify'


@app.route('/websock/connect')
def connect():
    try:
        host = request.args.get('host')
        port = request.args.get('port')
        if f'{host}:{port}' not in PROC.keys():
            host_port = random.randint(1024, 65535)
            proc = subprocess.Popen(f'websockify {host_port} {host}:{port}')
            PROC[f'{host}:{port}'] = {
                'host_port': host_port,
                'proc': proc
            }
            app.logger.info(f'Websockify <{host_port} -> {host}:{port}> created')
        else:
            app.logger.info(
                f'Websockify <{PROC[f"{host}:{port}"]["host_port"]} -> {host}:{port}> has been created before')
        time.sleep(2)
        return response('ok', data={'port': host_port})
    except Exception as e:
        app.logger.error(f'Fail to create Websockify to {host}:{port}>')
        return response('err', e)


@app.route('/websock/disconnect')
def disconnect():
    try:
        host = request.args.get('host')
        port = request.args.get('port')
        if f'{host}:{port}' in PROC.keys():
            PROC[f'{host}:{port}']['proc'].kill()
            host_port = PROC[f'{host}:{port}']['host_port']
            PROC.pop(f'{host}:{port}')
            app.logger.info(f'Websockify <{host_port} -> {host}:{port}> destroyed')
        else:
            app.logger.info(f"Websockify <{PROC[f'{host}:{port}']['host_port']} -> {host}:{port}> doesn't exsit")
        return response('ok')
    except Exception as e:
        app.logger.error(f'Fail to destroy Websockify to {host}:{port}>')
        return response('err', e)


if __name__ == '__main__':
    app.run(port=9000)
