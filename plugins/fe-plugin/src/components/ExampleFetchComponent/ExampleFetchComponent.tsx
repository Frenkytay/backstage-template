import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,  
} from '@material-ui/core';
import { MantineProvider, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
// import { useEntity } from '@backstage/plugin-catalog-react';

export const exampleUsers = {
  results: [
    {
      gender: 'female',
      name: { title: 'Miss', first: 'Carolyn', last: 'Marie' },
      email: 'carolyn.moore@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Carolyn',
      nat: 'GB',
    },
    {
      gender: 'male',
      name: { title: 'Mr', first: 'Derrick', last: 'Carter' },
      email: 'derrick.carter@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Derrick',
      nat: 'IE',
    },
    {
      gender: 'female',
      name: { title: 'Ms', first: 'Isabella', last: 'Li' },
      email: 'isabella.li@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Isabella',
      nat: 'CA',
    },
  ],
};

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    marginRight: 'auto',
  },
});

type User = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: string;
  nat: string;
};

type DenseTableProps = {
  users: User[];
};

export const DenseTable = ({ users }: DenseTableProps) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState(users);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [value, setValue] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [newUser, setNewUser] = useState<User>({
    gender: '',
    name: { title: '', first: '', last: '' },
    email: '',
    picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=NewUser',
    nat: '',
  });
  const handleEditOpen = (user: User) => {
    console.log(user);
    setEditUser(user);
    setOpenEdit(true);
    console.log(editUser);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  // Extract all unique nationalities from the users
  const nationalities = Array.from(new Set(users.map(user => user.nat)));

  const columns: TableColumn[] = [
    { title: 'Avatar', field: 'avatar' },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Nationality', field: 'nationality' },
    { title: 'Action', field: 'action' },
  ];

  const filteredUsers = userList.filter(
    user =>
      `${user.name.first} ${user.name.last}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nat.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const data = filteredUsers.map(user => ({
    avatar: (
      <img
        src={user.picture}
        className={classes.avatar}
        alt={user.name.first}
      />
    ),
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    nationality: user.nat,
    action: (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEditOpen(user)}
        >
          Edit
        </Button>
        <Button variant="contained" color="secondary">
          Delete
        </Button>
      </div>
    ),
  }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    if (!editUser) {
      return;
    }
    console.log(editUser);
    setUserList(prevList =>
      prevList.map(user => (user.email === editUser.email ? editUser : user)),
    );
    // setEditUser(null)
    // console.log(userList);
    setOpenEdit(false);
  };
  const handleAddUser = () => {
    setUserList([...userList, newUser]);
    setNewUser({
      gender: '',
      name: { title: '', first: '', last: '' },
      email: '',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=NewUser',
      nat: '',
    });
    setOpen(false);
  };
  return (
    <>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSearchQuery('')}
        >
          Clear
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          +
        </Button>
        <DateTimePicker
          // label="Pick date and time"
          color="dark"
          placeholder="Pick date and time"
        />
      </div>

      <Table
        title="Example User List"
        options={{ search: false, paging: false }}
        columns={columns}
        data={data}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            value={newUser.name.first}
            onChange={e =>
              setNewUser({
                ...newUser,
                name: { ...newUser.name, first: e.target.value },
              })
            }
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            value={newUser.name.last}
            onChange={e =>
              setNewUser({
                ...newUser,
                name: { ...newUser.name, last: e.target.value },
              })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Select
            searchable
            label="Nationality"
            searchValue={searchValue}
            data={nationalities.map(nat => ({ label: nat, value: nat }))}
            onSearchChange={setSearchValue} // This updates the search input
            onChange={value => setNewUser({ ...newUser, nat: value })}
          />
          {/* <Select
           searchable
            label="Nationality"
            data={nationalities.map(nat => ({ label: nat, value: nat }))}
            selected={newUser.nat}
            onChange={value => setNewUser({ ...newUser, nat: value })}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit user</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            value={editUser?.name.first}
            onChange={e =>
              setEditUser({
                ...editUser,
                name: { ...editUser.name, first: e.target.value },
              })
            }
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            value={editUser?.name.last}
            onChange={e =>
              setEditUser({
                ...editUser,
                name: { ...editUser?.name, last: e.target.value },
              })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editUser?.email}
            onChange={e => setEditUser({ ...editUser, email: e.target.value })}
          />
          <Select
            label="Nationality"
            items={nationalities.map(nat => ({ label: nat, value: nat }))}
            selected={newUser.nat}
            onChange={value => setEditUser({ ...editUser, nat: value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>

          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ExampleFetchComponent = () => {
  // const { entity } = useEntity();
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    return exampleUsers.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <MantineProvider withNormalizeCSS>
      <DenseTable users={value || []} />
    </MantineProvider>
  );
};
