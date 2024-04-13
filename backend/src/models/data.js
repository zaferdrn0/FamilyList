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

const DataType = mongoose.model('DataType', dataTypeSchema);
const DataPriority = mongoose.model('DataPriority', dataPrioritySchema);

const dataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    assignedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
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

}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);

export { Data, DataType, DataPriority };
