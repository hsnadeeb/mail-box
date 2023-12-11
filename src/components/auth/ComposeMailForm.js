import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TextEditor from "../auth/TextEditor";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

const ComposeMailForm = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const user = localStorage.getItem('UserMail');

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newMail = {
      senderEmail: user,
      receiverEmail: email,
      subject,
      content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      timestamp: new Date().toISOString(),
    };
  
    fetch("https://mailbox-da34e-default-rtdb.firebaseio.com/sent.json", {
      method: "POST",
      body: JSON.stringify(newMail),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to submit data. Status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Data submitted successfully:", data);
        setEmail("");
        setSubject("");
        setEditorState(EditorState.createEmpty());
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  return (
    <div>
      <h2>Compose Mail</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Recipient Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="editor">
          <Form.Label>Compose Mail</Form.Label>
          <TextEditor onEditorStateChange={handleEditorChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Mail
        </Button>
      </Form>
    </div>
  );
};

export default ComposeMailForm;
