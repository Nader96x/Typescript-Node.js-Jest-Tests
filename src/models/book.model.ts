import mongoose, {Document, Schema} from 'mongoose';

export interface BookInterface {
    title: string;
    description: string;
    author: string;
    publishYear: number;
}

export interface IBook extends BookInterface, Document {
}

const bookSchema: Schema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    publishYear: {type: Number, required: true},
}, {timestamps: true, versionKey: false});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
