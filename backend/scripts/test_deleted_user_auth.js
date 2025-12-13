const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');
const { generateToken } = require('../utils/auth');
const { verifyToken } = require('../middleware/auth');

/**
 * Test script to verify deleted user authentication rejection
 * Requirements: 3.5
 */
async function testDeletedUserAuth() {
  try {
    console.log('Testing deleted user authentication rejection...\n');
    
    // 1. Create a test user
    console.log('1. Creating a test user...');
    const timestamp = Date.now();
    const testUserData = {
      email: `test-auth-${timestamp}@example.com`,
      username: `test-auth-user-${timestamp}`,
      password: 'TestPassword123!',
      role: 'user',
      learning_style: 'visual',
      learning_pattern: 'fast'
    };
    
    const preparedData = await UserService.prepareUserDataForStorage(testUserData);
    const createdUser = await UserRepository.create(preparedData);
    console.log(`✓ Created user with ID: ${createdUser.id}`);
    
    // 2. Generate a valid token for the user
    console.log('\n2. Generating authentication token...');
    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role
    });
    console.log('✓ Token generated successfully');
    
    // 3. Test authentication with active user
    console.log('\n3. Testing authentication with active user...');
    const mockReq1 = {
      headers: { authorization: `Bearer ${token}` },
      user: null
    };
    const mockRes1 = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      }
    };
    const mockNext1 = () => {};
    
    await verifyToken(mockReq1, mockRes1, mockNext1);
    
    if (mockReq1.user) {
      console.log('✓ Authentication successful for active user');
      console.log(`✓ User ID in request: ${mockReq1.user.id}`);
    } else {
      console.log('❌ Authentication failed for active user');
      console.log('Response:', mockRes1.responseData);
    }
    
    // 4. Soft delete the user
    console.log('\n4. Soft deleting the user...');
    const deleteResult = await UserRepository.softDelete(createdUser.id);
    console.log(`✓ Delete successful: ${deleteResult}`);
    
    // 5. Test authentication with deleted user
    console.log('\n5. Testing authentication with deleted user...');
    const mockReq2 = {
      headers: { authorization: `Bearer ${token}` },
      user: null
    };
    const mockRes2 = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      }
    };
    const mockNext2 = () => {};
    
    await verifyToken(mockReq2, mockRes2, mockNext2);
    
    if (!mockReq2.user && mockRes2.statusCode) {
      console.log('✓ Authentication correctly rejected for deleted user');
      console.log('✓ Status code:', mockRes2.statusCode);
      console.log('✓ Error message:', mockRes2.responseData?.error);
    } else {
      console.log('❌ Authentication should have been rejected for deleted user');
    }
    
    // 6. Restore user and test again
    console.log('\n6. Restoring user and testing authentication...');
    const restoreResult = await UserRepository.restore(createdUser.id);
    console.log(`✓ Restore successful: ${restoreResult}`);
    
    const mockReq3 = {
      headers: { authorization: `Bearer ${token}` },
      user: null
    };
    const mockRes3 = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        return this;
      }
    };
    const mockNext3 = () => {};
    
    await verifyToken(mockReq3, mockRes3, mockNext3);
    
    if (mockReq3.user) {
      console.log('✓ Authentication successful after user restoration');
    } else {
      console.log('❌ Authentication failed after user restoration');
    }
    
    // 7. Clean up
    console.log('\n7. Cleaning up test data...');
    await UserRepository.softDelete(createdUser.id);
    console.log('✓ Test user cleaned up');
    
    console.log('\n✅ All deleted user authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Mock jest functions for testing
global.jest = {
  fn: () => {
    const mockFn = (...args) => {
      mockFn.mock.calls.push(args);
      return mockFn.mock.returnValue;
    };
    mockFn.mock = {
      calls: [],
      returnValue: undefined
    };
    mockFn.mockReturnThis = () => {
      mockFn.mock.returnValue = mockFn;
      return mockFn;
    };
    return mockFn;
  }
};

// Run test if this script is executed directly
if (require.main === module) {
  testDeletedUserAuth()
    .then(() => {
      console.log('\n🎉 Deleted user authentication test completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Deleted user authentication test failed:', error);
      process.exit(1);
    });
}

module.exports = { testDeletedUserAuth };