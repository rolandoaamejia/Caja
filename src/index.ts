import app from './server';

function main() {
    const port: number = app.get('port');

    app.listen(port);
    console.log(`Escuchando en el puerto ${port}`);
}

main();