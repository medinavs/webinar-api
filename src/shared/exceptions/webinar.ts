export class WebinarNotFoundError extends Error {
    constructor(public status = 404) {
        super('Webinar not found.')
    }
}