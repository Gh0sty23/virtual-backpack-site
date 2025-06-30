import { useMemo, useState } from "react";
import { Button, Form, Col, Row, Stack, Card, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select"
import { Tag } from "../../App";
import styles from "./NotesList.module.css"
import Sidebar from "../Sidebar/Sidebar";

type SimplifiedNote ={
    tags: Tag[]
    title: string
    id: string
}

type NoteListProps= {
    availableTags:Tag[]
    notes: SimplifiedNote[]
    onDeleteTag: (id:string) => void,
    onUpdateTag: (id: string, label:string) => void
}

type EditTagsModalProps ={
    show: boolean
    availableTags: Tag[]
    handleClose: () => void 
    onDeleteTag: (id:string) => void,
    onUpdateTag: (id: string, label:string) => void
}

export function NoteList({availableTags, notes, onUpdateTag, onDeleteTag}:NoteListProps){
    <Sidebar />
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)
  const filteredNotes = useMemo (() =>{
    return notes.filter(notes => {
        return (
            title ==="" || 
                notes.title.toLowerCase().includes(title.toLowerCase())) && 
            (selectedTags.length === 0 || 
                selectedTags.every(tag => notes.tags.
                    some(noteTag => noteTag.id === tag.id) 
        ))
    })
  }, [title, selectedTags, notes])
    return<>
    <Sidebar /> {/* renders the sidebar only for the apps and not the homepage. I cannot be assed to figure out a modular way to conditionally code this shit */}
        <Row className="align-items-center mb-4">
            <Col><h1>Notes</h1></Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                   <Link to="/new">
                    <Button variant="primary">Create</Button>
                   </Link> 
                   <Button 
                   onClick={() => setEditTagsModalIsOpen(true)} 
                   variant="outline-secondary">Edit Tags</Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className="mb-4">
                <Col>
                    <Form.Group controlId="Title">
                       <Form.Label>Title</Form.Label> 
                       <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                        value={selectedTags.map(tag => {
                            return {label: tag.label, value: tag.id}
                        })} 
                        options={availableTags.map(tag => {
                            return{label:tag.label, value: tag.id}
                        })}
                        onChange= {tags =>{
                            setSelectedTags(tags.map(tag =>{
                            return {label: tag.label, id:tag.value}
                            }))
                        }}
                        isMulti/> 
                  </Form.Group>
                </Col>

            </Row>
        </Form>
        <Row xs={1} sm={2}lg ={3} xl ={4} className="g-4">
            {filteredNotes.map(note=>(
                <Col key ={note.id}>
                    <NoteCard id={note.id} title={note.title} tags= {note.tags}/>
                </Col>
            ))}
        </Row>
        <EditTagsModal 
            show={editTagsModalIsOpen} 
            handleClose={
                () => setEditTagsModalIsOpen(false)} 
            availableTags={availableTags}
            onUpdateTag={onUpdateTag}
            onDeleteTag={onDeleteTag}
            />
    </>
}

function NoteCard({id,title,tags}: SimplifiedNote){
    return <Card 
        as ={Link} 
        to ={`/${id}`} 
        className={`h-100 text-reset text-decoration ${styles.card}`}>
        <Card.Body>
            <Stack gap={2} 
            className="align-items-center justify-content-center h-100">
                <span className="fs-4 text-justify">{title}</span>
                {tags.length >0 && (
                    <Stack gap={1} direction ="vertical"
                    className="justify-content-center flex-wrap">
                        {tags.map(tag => (
                            <Badge
                             className="text-truncate" 
                             key={tag.id}>
                                {tag.label}
                            </Badge>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card.Body>
    </Card>
}

function EditTagsModal({
    availableTags, 
    handleClose,
    show,
    onDeleteTag,
    onUpdateTag,
}:EditTagsModalProps){
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag=>(
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control 
                                type ="text" 
                                value={tag.label}
                                onChange={e => onUpdateTag(tag.id, e.target.value)}
                                />

                            </Col>
                            <Col xs="auto">
                                <Button onClick ={() => onDeleteTag(tag.id)}variant="outline-danger">
                                    &times;
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}
