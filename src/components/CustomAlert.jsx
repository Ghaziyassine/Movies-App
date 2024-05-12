import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, title, message, onCancel, customContent }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          {customContent ? (
            customContent
          ) : (
            <Text style={styles.message}>{message}</Text>
          )}
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.button}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    maxWidth: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default CustomAlert;
