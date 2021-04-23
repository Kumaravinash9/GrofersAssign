/**
 * @name ApiError
 * @description This class prototype for creating ApiError Objects
 */
class ApiError extends Error {
    constructor(detail = 'Internal Server Error', status = 404) {
        super(detail);

        this.detail = detail;
        this.status = status;
    }
}

module.exports = ApiError;
