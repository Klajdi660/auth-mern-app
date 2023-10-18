const createQuery = (conn, query, values) => {
    return new Promise((resolve, reject) => {
        conn.query(query, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export default createQuery;
