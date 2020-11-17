//Criação da classe de exceptions que extend error para tratar os erros ocorridos na aplicação:
class HttpException extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export default HttpException;