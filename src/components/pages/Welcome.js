import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaInbox, FaPaperPlane, FaEdit } from 'react-icons/fa';
import ComposeMailForm from '../auth/ComposeMailForm';
import AllMails from '../auth/AllMails';

const Welcome = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inbox');

  useEffect(() => {
    // Add code for fetching mails or other side effects based on selectedTab
    console.log('Selected tab changed:', selectedTab);
  }, [selectedTab]);

  const handleOpenEditor = () => {
    console.log('Compose Mail button clicked');
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const handleTabChange = (tab) => {
    console.log('Tab changed:', tab);
    setSelectedTab(tab);
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    
    // Clear user authentication state
    localStorage.removeItem('UserMail');
    localStorage.removeItem('token');
  
    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="container mt-3 ml-3 fluid">
      <div>
      <h2>Welcome to the mailbox</h2>
      <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="row mt-3">
        <div className="col-md-8">
          <Button onClick={() => handleTabChange('inbox')} active={selectedTab === 'inbox'}>
            <FaInbox className="mr-1" /> Inbox
          </Button>
          <Button onClick={() => handleTabChange('sent')} active={selectedTab === 'sent'}>
            <FaPaperPlane className="mr-1" /> Sent
          </Button>
          <Button onClick={handleOpenEditor}><FaEdit className="mr-1" /> Compose Mail</Button>
    

          {selectedTab === 'inbox' && <AllMails type="inbox" />}
          {selectedTab === 'sent' && <AllMails type="sent" />}
          
            
              <Modal show={showEditor} onHide={handleCloseEditor}>
                <Modal.Header closeButton>
                  <Modal.Title>Mail Editor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ComposeMailForm />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditor}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            
        </div>
      </div>
    </div>
  );
};

export default Welcome;
