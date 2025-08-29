// Test Dialogflow integration with database lookups
const { sendMessageToDialogflow } = require('./helpers/dialogflow');
const { Lecture, Category } = require('./models');
const { sequelize } = require('./models');

async function testChatbotFlow() {
  try {
    console.log('🤖 Starting Chatbot Integration Test');
    
    // 1. First establish database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // 2. Test a simple greeting
    const greetingResponse = await sendMessageToDialogflow('Halo');
    console.log('\n📝 Greeting Test:');
    console.log('Intent:', greetingResponse.intent);
    console.log('Response:', greetingResponse.text);
    
    // 3. Test course info intent with a specific technique
    const courseQuery = 'Saya ingin kursus tentang Ultrasonic Testing';
    console.log(`\n📝 Course Query Test: "${courseQuery}"`);
    
    const courseResponse = await sendMessageToDialogflow(courseQuery, 'test-session-123');
    console.log('Intent:', courseResponse.intent);
    console.log('Response:', courseResponse.text);
    console.log('Parameters:', JSON.stringify(courseResponse.parameters, null, 2));
    
    // 4. Manually simulate the database lookup from controller
    if (courseResponse.intent === 'course_info' || courseResponse.intent === 'course_search') {
      // Try to get course type from parameters
      let courseType;
      
      if (courseResponse.parameters && courseResponse.parameters['course-type']) {
        const param = courseResponse.parameters['course-type'];
        courseType = param.stringValue || param.listValue?.values?.[0]?.stringValue || param;
      }
      
      if (courseType) {
        console.log(`🔍 Looking up courses for: ${courseType}`);
        
        // Query database
        const courses = await Lecture.findAll({
          where: {
            technique: {
              [sequelize.Op.iLike]: `%${courseType}%`
            }
          },
          include: [{ model: Category, as: "category" }],
          limit: 3
        });
        
        console.log(`✅ Found ${courses.length} matching courses:`);
        courses.forEach(course => {
          console.log(`  - ${course.name} (${course.technique}) - ${course.price}`);
        });
      } else {
        console.log('❌ No course type detected in parameters');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('\n🧹 Test cleanup complete');
  }
}

// Run the test
testChatbotFlow()
  .then(success => {
    console.log(success ? '✅ All tests passed!' : '❌ Tests failed');
    process.exit(success ? 0 : 1);
  });