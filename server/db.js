import mongoose from 'mongoose';

const databaseConnection = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`MongoDB connected: ${connect.connection.host}`)
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

export default databaseConnection;
