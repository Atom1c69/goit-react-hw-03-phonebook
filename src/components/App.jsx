import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import { Form } from './Form/Form';
import { ContactList } from 'components/ContactList/ContactList';
import { Filter } from './Filter/Filter';
import css from 'components/Form/Form.module.css';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const stringifiedContacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(stringifiedContacts) ?? this.state.contacts;
    this.setState({ contacts: parsedContacts });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      const stringifiedJsonContacts = JSON.stringify(this.state.contacts);
      localStorage.setItem('contacts', stringifiedJsonContacts)
    }
  }

  onChangeInput = e => {
    const value = e.target.value;
    const nameInput = e.target.name;
    this.setState({
      [nameInput]: value,
    });
  };

  filterContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  onDeleteContact = id => {
    this.setState({
      contacts: this.state.contacts.filter(item => item.id !== id),
    });
  };

  onAddContact = newUser => {
    const hasDuplicates = this.state.contacts.some(
      item =>
        item.name.toLowerCase() === newUser.name.toLowerCase() ||
        item.number === newUser.number
    );

    if (hasDuplicates) {
      alert(
        `A contact with the name: '${newUser.name}' and number: '${newUser.number}' is already in the list!`
      );
      return;
    }

    const user = {
      ...newUser,
      id: nanoid(),
    };

    this.setState(prevState => ({
      contacts: [...prevState.contacts, user],
    }));
  };

  render() {
    return (
      <div className={css.container}>
        <h1 className={css.title}>Phonebook</h1>
        <Form onAddContact={this.onAddContact} />
        <h2 className={css.title}>Contacts</h2>
        <Filter changeInput={this.onChangeInput} filter={this.state.filter} />
        <ContactList
          option={this.filterContacts()}
          deleteContact={this.onDeleteContact}
        />
      </div>
    );
  }
}