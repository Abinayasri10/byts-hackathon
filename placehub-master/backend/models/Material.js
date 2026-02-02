const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    type: {
      type: String,
      enum: ['link', 'document', 'code', 'note', 'resource'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: String,
    fileSize: Number,
    fileType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);