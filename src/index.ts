import app from './server';

async function main() {
    const port: number = app.get('port');

    await app.listen(port);
    console.log(`Escuchando en el puerto ${port}`);
}

main();