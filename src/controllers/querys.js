module.exports = class Query {
    constructor(db = '') {
        this.db = db;
    }

    async select (req,text, values = [])
    {
        const { dbs } = req.__context;
	    const coreDb = dbs[this.db];
        let query;
        if (values.length === 0){
            query = text; 
        }

        else {
            query = {
                text: text,
                values: values,
            };  
        }

        const result = await coreDb.conn.query(query);
        return result.rows;

    }

    async statement (req,text, values){
        const { dbs } = req.__context;
	    const coreDb = dbs[this.db];
        const query = {
            text: text,
            values: values,
        };  
        const statement = await coreDb.conn.query(query);
        return statement;
    }

};