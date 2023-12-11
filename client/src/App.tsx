import { useState } from 'react';
import './App.css';
import { Button, Card, Container, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import axios, { CancelToken, isCancel } from 'axios';

interface User {
  email: string;
  number: string;
}

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    email: '',
    number: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cancelSource) {
      cancelSource.cancel('Previous request canceled');
    }
    const newCancelSource = axios.CancelToken.source();
    setCancelSource(newCancelSource);

    try {
      setLoading(true)
      setUsers([])
      setError(null)
      axios.get('http://localhost:5000/users/find', {
        cancelToken: newCancelSource.token,
        params: formData
      }).then((response) => {
        if (response.status === 200) {
          let users: User[] = [];
          response.data.map((user: any) => {
            users.push({
              email: user.email,
              number: user.number.replace(/(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3')
            })
          })
          setLoading(false)
          setUsers(users)
        }
      });

    } catch (error) {
      if (isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error:', error);
      }
      
    }
  };

  return (
    <Container className="mt-5">

      <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>

        <Card>

          <Card.Header>
            <h5>Поиск пользователей</h5>
          </Card.Header>

          <Card.Body>

            <InputGroup className="mb-3">
              <InputGroup.Text id="email-addon">Email</InputGroup.Text>
              <Form.Control
                placeholder="введите почту пользователя"
                aria-label="Email"
                aria-describedby="email-addon"
                value={formData.email}
                required={true}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="number-addon">Номер телефона</InputGroup.Text>
              <InputMask mask="99-99-99"
                className='form-control'
                placeholder='введите номер телефона'
                onChange={(e: any) => setFormData({ ...formData, number: e.target.value })}
                value={formData.number} />
            </InputGroup>

            {
              error && <p className="text-danger">{error}</p>
            }

            {
              loading && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            }

            {
              users && users.length > 0 && <>
                <h6>Результаты поиска:</h6>
                <ListGroup>
                  {
                    users.map((user,index) => {
                      return <ListGroup.Item key={index}>
                        <div className='d-flex justify-content-between'>
                          <p className="mb-0">
                            {user.email}
                          </p>
                          <p className="mb-0">
                            {user.number}
                          </p>
                        </div>
                      </ListGroup.Item>
                    })
                  }
                </ListGroup>
              </>
            }

          </Card.Body>

          <Card.Footer>

            <Button variant="primary" type="submit">
              Найти
            </Button>

          </Card.Footer>

        </Card>

      </Form>

    </Container>
  );
}

export default App;
