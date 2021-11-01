import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Modal, Dropdown, Button, Form, Alert, Spinner } from "react-bootstrap";
import { SHARE_TASK } from "../apollo/mutationDefs";
import Task from "../types/task";

interface ShareModalProps {
  task: Task;
}

let email = "";

const ShareModal: React.FC<ShareModalProps> = (props) => {
  const [show, setShow] = useState(false);
  const { task } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [shareTask, { data, error, loading }] = useMutation(SHARE_TASK, {
    onCompleted(data) {
      if (data.shareTask.success)
        setTimeout(() => {
          handleClose();
        }, 1200);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <>
      <Dropdown.Item onClick={() => handleShow()}>Share</Dropdown.Item>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Share Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              shareTask({ variables: { email, task_id: task.id } });
            }}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => (email = e.target.value.toLowerCase().trim())}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Sharing...{" "}
                </>
              ) : (
                "Share"
              )}
            </Button>
            <Alert>
              {data ? data.shareTask.message : ""}
              {error?.message ? error.message : ""}
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShareModal;
