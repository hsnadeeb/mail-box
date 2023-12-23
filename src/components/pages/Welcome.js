import React, { useState, useEffect } from 'react';
// import { Button } from 'react-bootstrap';
import { FaInbox, FaPaperPlane, FaEdit } from 'react-icons/fa';
import ComposeMailForm from '../auth/ComposeMailForm';
import AllMails from '../auth/AllMails';
import { Table, Badge, Modal, Button, Container, Row, Col, Nav } from 'react-bootstrap';
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
  let username=localStorage.getItem('UserMail');
  return (
    <div className="container-fluid mt-3">


        <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="mb-0">Welcome to your mailbox</h1>
          <h3 className="mb-3">{username}</h3>
        </div>
        <div>
          <Button className="mr-3" variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
         
        </div>
      </div>


      <Row>
        {/* Left Side - Tabs */}
        <Col md={3}>
          <div className="d-flex flex-column align-items-start">
            <Nav className="flex-column mt-3">
              <Nav.Link onClick={() => handleTabChange('inbox')} active={selectedTab === 'inbox'}>
                <FaInbox className="mr-1" /> Inbox
              </Nav.Link>
              <Nav.Link onClick={() => handleTabChange('sent')} active={selectedTab === 'sent'}>
                <FaPaperPlane className="mr-1" /> Sent
              </Nav.Link>
              <Nav.Link onClick={handleOpenEditor}>
                <FaEdit className="mr-1" /> Compose Mail
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Right Side - Mail Content */}
        <Col md={9}>
          <div className="row mt-3">
            <Col>
              {selectedTab === 'inbox' && <AllMails type="inbox" />}
              {selectedTab === 'sent' && <AllMails type="sent" />}
            </Col>
          </div>
        </Col>
      </Row>

      {/* Mail Editor Modal */}
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
  );
};

export default Welcome;
