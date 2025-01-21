import mongoose from "mongoose"

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://bytebun:bytebun1212025@cluster0.rv58u.mongodb.net/bytebun').then(()=>console.log("DB Connected"))
}

export {connectDB}
