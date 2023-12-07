import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    TextInput,
    Alert,
    TouchableOpacity,
    Modal,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const hardcodeCustomers = () => {
        const hardcodedCustomers = [
            {
                id: 1,
                name: 'Qohn Doe',
                dob: '1991-11-11',
                icNumber: '123458789012',
                registerDate: '2023-01-11',
                address: '122 Main Street, City',
            },
            {
                id: 2,
                name: 'John Doe',
                dob: '1990-07-01',
                icNumber: '144456789012',
                registerDate: '2023-12-01',
                address: '123 Main Street, City',
            },
            {
                id: 3,
                name: 'Sohn Doe',
                dob: '1999-05-01',
                icNumber: '123456789012',
                registerDate: '2023-02-01',
                address: '126 Main Street, City',
            },
            {
                id: 4,
                name: 'Cohn Doe',
                dob: '1980-01-01',
                icNumber: '123456429012',
                registerDate: '2023-11-01',
                address: '128 Main Street, City',
            },
            {
                id: 5,
                name: 'Gohn Doe',
                dob: '1790-02-01',
                icNumber: '123456786612',
                registerDate: '2021-01-01',
                address: '123 Main Street, City',
            },
        ];

        setCustomers([...customers, ...hardcodedCustomers]);
        setLoaded(true);
    };

    useEffect(() => {
        if (!loaded) {
            hardcodeCustomers();
        }
    }, []);

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [icNumber, setIcNumber] = useState('');
    const [address, setAddress] = useState('');
    const [editIcNumber, setEditIcNumber] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const [registerModal, setRegisterModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const registerCustomer = () => {
        if (!name || !dob || !icNumber || !address) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const isNameValid = /^[a-zA-Z]+$/.test(name);
        if (!isNameValid) {
            Alert.alert('Name should contain only letters.');
            return;
        }
        const formatToCheck = "YYYY-MM-DD";
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dob);
        if (isValidFormat) {
            const parsedDate = moment(dob, formatToCheck, true);

            if (parsedDate.isValid() && parsedDate.month() + 1 <= 12 && parsedDate.date() <= 31) {
                setDob(dob)
            } else {
                Alert.alert('Please enter a valid date.');
                return;
            }
        } else {
            Alert.alert('Incorrect Format (YYYY-MM-DD).');
            return;
        }
        const isValidICNumber = /^\d{1,12}$/.test(icNumber);
        if (!isValidICNumber) {
            Alert.alert('IC number should only contain 12 digits.');
            return;
        }

        const newCustomer = {
            id: Math.floor(Math.random() * 1000),
            name,
            dob,
            icNumber,
            registerDate: new Date().toISOString().split('T')[0],
            address,
        };

        setCustomers([...customers, newCustomer]);
        Alert.alert('Registration Successful', 'Customer registered successfully');
        setName('');
        setDob('');
        setIcNumber('');
        setAddress('');
        setRegisterModal(false);
    };

    const updateCustomer = () => {
        const index = customers.findIndex((c) => c.id === selectedCustomer.id);

        if (index !== -1) {
            const updatedCustomers = [
                ...customers.slice(0, index),
                { ...selectedCustomer, icNumber: editIcNumber, address: editAddress },
                ...customers.slice(index + 1),
            ];

            setCustomers(updatedCustomers);
        }
        setEditModal(false);
        setSelectedCustomer(null);
    };

    const renderList = ({ item }) => (
        <View style={styles.customerContainer}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedCustomer(item);
                    setEditIcNumber(item.icNumber);
                    setEditAddress(item.address);
                    setEditModal(true);
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.customerText}>Name:</Text>
                        <Text style={styles.customerText}>DOB:</Text>
                        <Text style={styles.customerText}>IC Number:</Text>
                        <Text style={styles.customerText}>Address:</Text>
                        <Text style={styles.customerText}>Register Date:</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.customerText2}>{item.name}</Text>
                        <Text style={styles.customerText2}>{item.dob}</Text>
                        <Text style={styles.customerText2}>{item.icNumber}</Text>
                        <Text style={styles.customerText2} numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
                        <Text style={styles.customerText2}>{item.registerDate}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, }}>Customer List</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                backgroundColor: 'white',
                width: Dimensions.get('screen').height * 0.385,
                alignSelf: 'center',

                borderRadius: 10,
            }}>
                <TextInput
                    style={{
                        width: Dimensions.get('screen').height * 0.325,
                        paddingLeft: 10,
                    }}
                    placeholder="Search by name"
                    onChangeText={(text) => {
                        const filtered = customers.filter((customer) =>
                            customer.name.toLowerCase().includes(text.toLowerCase())
                        );
                        setFilteredCustomers(filtered);
                    }}
                />
            </View>
            {filteredCustomers && filteredCustomers.length > 0 ? (
                <View style={{
                    alignSelf: 'center',
                    marginTop: 20,
                    height: Dimensions.get('screen').height * 0.7
                }}>
                    <FlatList
                        data={filteredCustomers}
                        renderItem={renderList}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            ) : (
                customers && customers.length > 0 && filteredCustomers.length <= 0 ? (
                    <View style={{
                        alignSelf: 'center',
                        marginTop: 20,
                        height: Dimensions.get('screen').height * 0.7,
                    }}>
                        <FlatList
                            data={customers}
                            renderItem={renderList}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                ) : (
                    <View style={{ alignSelf: 'center', marginTop: 100, }}>
                        <Text style={{ fontSize: 16, color: 'gray' }}>No customer data found</Text>
                    </View>
                )
            )}

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    backgroundColor: '#D38062',
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 3.22,
                    elevation: 5,

                    alignItems: 'center',
                    justifyContent: 'center',

                    left: Dimensions.get('screen').width * 0.75,
                    bottom: Dimensions.get('screen').height * 0.05,
                }}
                onPress={() => { setRegisterModal(true) }}>
                <Text style={{ fontSize: 30, }}>+</Text>
            </TouchableOpacity>
            <Modal
                style={{ flex: 1, }}
                visible={registerModal}
                transparent={true}
                animationType='fade'>
                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 10,
                    height: Dimensions.get('screen').height * 2,
                }}>
                    <View style={{
                        marginTop: 100,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        padding: 15,

                        borderRadius: 15,

                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 3.22,
                        elevation: 3,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 30, marginBottom: 10, }}>Registration</Text>
                        </View>
                        <Text style={[styles.label, { fontWeight: 'bold', }]}>Name</Text>
                        <TextInput style={styles.input} onChangeText={(text) => setName(text.charAt(0).toUpperCase() + text.slice(1))} value={name} />

                        <Text style={[styles.label, { fontWeight: 'bold', }]}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setDob(text)}
                            value={dob}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numeric"
                        />

                        <Text style={[styles.label, { fontWeight: 'bold', }]}>IC Number</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setIcNumber(text)}
                            value={icNumber}
                            keyboardType="numeric"
                            maxLength={12}
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={[styles.label, { fontWeight: 'bold', }]}>Address</Text>
                            <Text>{address.length}</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setAddress(text)}
                            value={address}
                            maxLength={100}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={styles.registerButton} onPress={registerCustomer}>
                                <Text>Register</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => { setRegisterModal(false) }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                style={{ flex: 1, }}
                visible={editModal}
                transparent={true}
                animationType='fade'>
                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 10,
                    height: Dimensions.get('screen').height * 2,
                }}>
                    {selectedCustomer && selectedCustomer != null ?
                        <>
                            <View style={{
                                marginTop: 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                padding: 15,

                                borderRadius: 15,

                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 3.22,
                                elevation: 3,
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 30, marginBottom: 10, }}>Update Customer</Text>
                                </View>
                                <Text style={[styles.label, { fontWeight: 'bold', }]}>Name</Text>
                                <Text style={styles.label}>{selectedCustomer.name}</Text>

                                <Text style={[styles.label, { fontWeight: 'bold', }]}>Date of Birth</Text>
                                <Text style={styles.label}>{selectedCustomer.dob}</Text>


                                <Text style={[styles.label, { fontWeight: 'bold', }]}>IC Number</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => setEditIcNumber(text)}
                                    value={editIcNumber}
                                    keyboardType="numeric"
                                    maxLength={12}
                                />

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text style={[styles.label, { fontWeight: 'bold', }]}>Address</Text>
                                    <Text>{editAddress.length}</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => setEditAddress(text)}
                                    value={editAddress}
                                    maxLength={100}
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity
                                        style={styles.registerButton}
                                        onPress={updateCustomer}>
                                        <Text>Update</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => {
                                            setEditModal(false);
                                            setSelectedCustomer(null);
                                        }}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                        :
                        <></>
                    }

                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    customerContainer: {
        width: Dimensions.get('screen').width * 0.8,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 3.22,
        elevation: 1,
    },
    customerText: {
        fontSize: 16,
        marginBottom: 5,
        marginRight: 15,
    },
    customerText2: {
        fontSize: 16,
        marginBottom: 5,
        width: Dimensions.get('screen').width * 0.4,
    },
    input: {
        width: Dimensions.get('screen').width * 0.7,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginRight: 15,
    },
    registerButton: {
        padding: 15,
        paddingHorizontal: Dimensions.get('screen').width * 0.1,
        backgroundColor: '#D38062',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 3.22,
        elevation: 5,

        borderRadius: 10,
    },
    cancelButton: {
        padding: 15,
        paddingHorizontal: Dimensions.get('screen').width * 0.1,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 3.22,
        elevation: 5,

        borderRadius: 10,
    },
});

export default CustomerList;
