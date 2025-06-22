#!/bin/bash

echo "=== Todo List Application Container Testing ==="
echo ""

# Test 1: Check if containers are running
echo "1. Checking container status..."
docker-compose ps

echo ""
echo "2. Testing container connectivity..."

# Test 2: Test MongoDB connection
echo "Testing MongoDB..."
if docker-compose exec mongo mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running and accessible"
else
    echo "❌ MongoDB connection failed"
fi

# Test 3: Test Backend API
echo "Testing Backend API..."
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

# Test 4: Test Frontend
echo "Testing Frontend..."
if curl -s http://localhost:8080/ > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

# Test 5: Test API endpoints
echo "Testing API endpoints..."

# Test GET todos
echo "Testing GET /api/gettodos..."
if curl -s http://localhost:3000/api/gettodos > /dev/null; then
    echo "✅ GET /api/gettodos is working"
else
    echo "❌ GET /api/gettodos failed"
fi

# Test POST todo
echo "Testing POST /api/todos..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Test Description","date":"2024-01-15"}')

if echo "$RESPONSE" | grep -q "_id"; then
    echo "✅ POST /api/todos is working"
    TODO_ID=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo "Created todo with ID: $TODO_ID"
else
    echo "❌ POST /api/todos failed"
    echo "Response: $RESPONSE"
fi

# Test PUT todo (if we have a todo ID)
if [ ! -z "$TODO_ID" ]; then
    echo "Testing PUT /api/todos/$TODO_ID..."
    if curl -s -X PUT http://localhost:3000/api/todos/$TODO_ID \
      -H "Content-Type: application/json" \
      -d '{"strStatus":true}' > /dev/null; then
        echo "✅ PUT /api/todos/$TODO_ID is working"
    else
        echo "❌ PUT /api/todos/$TODO_ID failed"
    fi

    # Test DELETE todo
    echo "Testing DELETE /api/todos/$TODO_ID..."
    if curl -s -X DELETE http://localhost:3000/api/todos/$TODO_ID > /dev/null; then
        echo "✅ DELETE /api/todos/$TODO_ID is working"
    else
        echo "❌ DELETE /api/todos/$TODO_ID failed"
    fi
fi

echo ""
echo "=== Testing Complete ==="
