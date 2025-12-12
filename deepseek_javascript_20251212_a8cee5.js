// Validación exhaustiva en el servidor (si se agrega backend)
function validarDatosEntrada(datos) {
    const reglas = {
        nombre: { tipo: 'string', min: 2, max: 100, regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
        email: { tipo: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        telefono: { tipo: 'string', regex: /^[\d\s\-\+\(\)]{8,20}$/ },
        codigo: { tipo: 'string', longitud: 8, regex: /^ENC[A-Z0-9]{5}$/ }
    };

    const errores = [];

    Object.keys(reglas).forEach(campo => {
        if (datos[campo]) {
            const regla = reglas[campo];
            const valor = datos[campo].toString().trim();

            if (regla.tipo === 'string' && typeof valor !== 'string') {
                errores.push(`${campo}: debe ser texto`);
            }

            if (regla.min && valor.length < regla.min) {
                errores.push(`${campo}: mínimo ${regla.min} caracteres`);
            }

            if (regla.max && valor.length > regla.max) {
                errores.push(`${campo}: máximo ${regla.max} caracteres`);
            }

            if (regla.regex && !regla.regex.test(valor)) {
                errores.push(`${campo}: formato inválido`);
            }

            if (regla.longitud && valor.length !== regla.longitud) {
                errores.push(`${campo}: debe tener ${regla.longitud} caracteres`);
            }
        }
    });

    return errores;
}