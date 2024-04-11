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

// dataType ve dataPriority için Mongoose modellerini tanımlayın
const DataType = mongoose.model('DataType', dataTypeSchema);
const DataPriority = mongoose.model('DataPriority', dataPrioritySchema);

const dataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    assignedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // 'users' koleksiyonunu referans alır
        required: false
    }],
    dataType: {
        type: Schema.Types.ObjectId,
        ref: 'DataType', // 'DataType' modelini referans alır
        required: false
    },
    dataPriority: {
        type: Schema.Types.ObjectId,
        ref: 'DataPriority', // 'DataPriority' modelini referans alır
        required: false
    }
}, {
    timestamps: true // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

const Data = mongoose.model('Data', dataSchema);

export { Data, DataType, DataPriority };
