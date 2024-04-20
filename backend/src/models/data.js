import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

const dataPrioritySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});
const quantitySchema = new Schema({
    value: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
});

const DataType = mongoose.model('DataType', dataTypeSchema);
const DataPriority = mongoose.model('DataPriority', dataPrioritySchema);

const dataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    assignedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }],
    dataType: {
        type: Schema.Types.ObjectId,
        ref: 'DataType',
        required: false
    },
    dataPriority: {
        type: Schema.Types.ObjectId,
        ref: 'DataPriority',
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'canceled', 'done'],
        required: true,
    },
    placeToBuy: {
        type: String,
        required: false
    },
    quantity: {
        type: quantitySchema,
        required: false,
    },

}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);

export { Data, DataType, DataPriority };
