require('dotenv').config();
const { Lecture } = require('./models');

const lectureId = 25;
const muxPlaybackId = 'WXXlqgEyoxifvhg2R0101jhc00KqEqQA3Pr024tXX9Cy3Ms';
const videoUrl = `https://stream.mux.com/${muxPlaybackId}.m3u8`;

const updateLecture = async () => {
  try {
    const lecture = await Lecture.findByPk(lectureId);
    if (lecture) {
      lecture.videoUrl = videoUrl;
      await lecture.save();
      console.log(`Successfully updated lecture ${lectureId} with videoUrl: ${videoUrl}`);
    } else {
      console.log(`Lecture with ID ${lectureId} not found.`);
    }
  } catch (error) {
    console.error('Error updating lecture:', error);
  }
};

updateLecture();
