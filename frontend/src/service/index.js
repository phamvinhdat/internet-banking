export const authHeader = _ => {
    return {
        'Content-type': 'application/json',
        'Authorization': 'Bearer' + auth.token
    }
}

