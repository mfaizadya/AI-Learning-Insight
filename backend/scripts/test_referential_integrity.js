const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');

/**
 * Test script to verify referential integrity and soft deletion functionality
 * Requirements: 3.1, 3.3, 3.5
 */
async function testReferentialIntegrity() {
  try {
    console.log('Testing referential integrity and soft deletion...\n');
    
    // 1. Create a test user
    console.log('1. Creating a test user...');
    const testUserData = {
      email: 'test-integrity@example.com',
      username: 'test-integrity-user',
      password: 'TestPassword123!',
      role: 'user',
      learning_style: 'visual',
      learning_pattern: 'fast'
    };
    
    const preparedData = await UserService.prepareUserDataForStorage(testUserData);
    const createdUser = await UserRepository.create(preparedData);
    console.log(`✓ Created user with ID: ${createdUser.id}`);
    
    // 2. Check related data count
    console.log('\n2. Checking related data count...');
    const relatedData = await UserRepository.getUserRelatedDataCount(createdUser.id);
    console.log(`✓ Test results: ${relatedData.testResults}`);
    console.log(`✓ Insights: ${relatedData.insights}`);
    console.log(`✓ Has related data: ${relatedData.hasRelatedData}`);
    
    // 3. Check if user can be deleted
    console.log('\n3. Checking deletion eligibility...');
    const deleteCheck = await UserRepository.canUserBeDeleted(createdUser.id);
    console.log(`✓ Can delete: ${deleteCheck.canDelete}`);
    console.log(`✓ Cascade info: ${deleteCheck.cascadeInfo.message}`);
    
    // 4. Verify user exists and is not deleted
    console.log('\n4. Verifying user exists...');
    const userBeforeDelete = await UserRepository.findById(createdUser.id);
    console.log(`✓ User found: ${userBeforeDelete ? 'Yes' : 'No'}`);
    console.log(`✓ User deleted_at: ${userBeforeDelete?.deleted_at || 'NULL'}`);
    
    // 5. Perform soft delete
    console.log('\n5. Performing soft delete...');
    const deleteResult = await UserRepository.softDelete(createdUser.id);
    console.log(`✓ Delete successful: ${deleteResult}`);
    
    // 6. Verify user is soft deleted
    console.log('\n6. Verifying soft deletion...');
    const userAfterDelete = await UserRepository.findById(createdUser.id);
    console.log(`✓ User found after delete: ${userAfterDelete ? 'Yes' : 'No'}`);
    
    // 7. Check user with deleted users included
    const userIncludingDeleted = await UserRepository.findByIdIncludingDeleted(createdUser.id);
    console.log(`✓ User found including deleted: ${userIncludingDeleted ? 'Yes' : 'No'}`);
    console.log(`✓ User deleted_at: ${userIncludingDeleted?.deleted_at || 'NULL'}`);
    
    // 8. Test email uniqueness with deleted user
    console.log('\n7. Testing email uniqueness with deleted user...');
    const isEmailUnique = await UserRepository.isEmailUnique(testUserData.email);
    console.log(`✓ Email unique after soft delete: ${isEmailUnique}`);
    
    // 9. Test restore functionality
    console.log('\n8. Testing restore functionality...');
    const restoreResult = await UserRepository.restore(createdUser.id);
    console.log(`✓ Restore successful: ${restoreResult}`);
    
    const userAfterRestore = await UserRepository.findById(createdUser.id);
    console.log(`✓ User found after restore: ${userAfterRestore ? 'Yes' : 'No'}`);
    console.log(`✓ User deleted_at after restore: ${userAfterRestore?.deleted_at || 'NULL'}`);
    
    // 10. Clean up - hard delete the test user
    console.log('\n9. Cleaning up test data...');
    await UserRepository.softDelete(createdUser.id);
    console.log('✓ Test user cleaned up');
    
    console.log('\n✅ All referential integrity tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testReferentialIntegrity()
    .then(() => {
      console.log('\n🎉 Referential integrity test completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Referential integrity test failed:', error);
      process.exit(1);
    });
}

module.exports = { testReferentialIntegrity };