const dev = {
    PORT: 3000,
    ROOT_API: 'http://localhost:8080/api/v1',
}

const prod = {}

const config = process.env.REACT_APP_ENV === 'production' ? prod : dev
export default {...config}