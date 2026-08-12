const { db } = require('../firebase');
const Agent = require('../models/Agent');

// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agentsRef = db.collection('agents');
    const snapshot = await agentsRef.get();
    
    const agents = [];
    snapshot.forEach(doc => {
      agents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      agents: agents
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get agent by ID
exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const agentDoc = await db.collection('agents').doc(id).get();
    
    if (!agentDoc.exists) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json({
      success: true,
      agent: {
        id: agentDoc.id,
        ...agentDoc.data()
      }
    });
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add new agent
exports.addAgent = async (req, res) => {
  try {
    const agentData = req.body;
    
    const agent = new Agent(agentData);
    agent.validate();

    const docRef = await db.collection('agents').add(agent.toObject());
    
    res.status(201).json({
      success: true,
      message: 'Agent added successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Add agent error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update agent
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const agentRef = db.collection('agents').doc(id);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    updates.updatedAt = new Date().toISOString();
    await agentRef.update(updates);

    const updatedDoc = await agentRef.get();

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete agent
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agentRef = db.collection('agents').doc(id);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await agentRef.delete();

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ error: error.message });
  }
};