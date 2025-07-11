import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { CSSProperties } from "react";

type NoteProps = {
  onDelete: (id: string) => void
}
const scrollContainerStyle: CSSProperties = {
  maxHeight: "70vh",
  overflowY: "auto",
  paddingRight: "1rem",
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote()
  const navigate = useNavigate()

  return <>
    <Row className="align-items-center mb-4">
      <Col>
        <h1>
          {note.title}
          {note.tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="flex-wrap">
              {note.tags.map(tag => (
                <Badge
                  className="text-truncate"
                  key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </h1>
      </Col>
      <Col xs="auto">
        <Stack gap={2} direction="horizontal">
          <Link to={`/${note.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button onClick={() => {
            onDelete(note.id)
            navigate(("/notes"))
          }} variant="outline-danger">
            Delete
          </Button>
          <Link to="/notes">
            <Button variant="outline-secondary">Back</Button>
          </Link>

        </Stack>
      </Col>
    </Row>
    <div style={scrollContainerStyle}>
      <ReactMarkdown>
        {note.markdown}
      </ReactMarkdown>
    </div>
  </>
}
