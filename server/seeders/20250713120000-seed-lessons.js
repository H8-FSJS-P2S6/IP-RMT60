'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample lessons for different lectures
    const lessons = [
      // JavaScript Fundamentals (LectureId: 1)
      {
        title: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript programming language and its syntax.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: 1800, // 30 minutes
        order: 1,
        isPreview: true,
        LectureId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Variables and Data Types",
        description: "Understanding different data types and how to declare variables in JavaScript.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        duration: 2400, // 40 minutes
        order: 2,
        isPreview: false,
        LectureId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Functions and Scope",
        description: "Learn how to create and use functions, understanding scope in JavaScript.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        duration: 3600, // 60 minutes
        order: 3,
        isPreview: false,
        LectureId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Objects and Arrays",
        description: "Working with complex data structures in JavaScript.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: 2700, // 45 minutes
        order: 4,
        isPreview: false,
        LectureId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // React Development (LectureId: 2)
      {
        title: "Introduction to React",
        description: "Getting started with React library and understanding components.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: 2100, // 35 minutes
        order: 1,
        isPreview: true,
        LectureId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "JSX and Components",
        description: "Learn JSX syntax and how to create reusable components.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        duration: 3000, // 50 minutes
        order: 2,
        isPreview: false,
        LectureId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "State and Props",
        description: "Understanding state management and props in React components.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        duration: 3600, // 60 minutes
        order: 3,
        isPreview: false,
        LectureId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Node.js Backend (LectureId: 3)
      {
        title: "Node.js Introduction",
        description: "Getting started with Node.js for backend development.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: 1800, // 30 minutes
        order: 1,
        isPreview: true,
        LectureId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Express.js Framework",
        description: "Building web applications with Express.js framework.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        duration: 4200, // 70 minutes
        order: 2,
        isPreview: false,
        LectureId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Database Integration",
        description: "Connecting and working with databases in Node.js applications.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        duration: 3900, // 65 minutes
        order: 3,
        isPreview: false,
        LectureId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Lessons', lessons, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lessons', null, {});
  }
};
