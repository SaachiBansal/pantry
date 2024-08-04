'use client'
import { useState, useEffect } from 'react'
import { firestore } from '/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material"
import { collection, deleteDoc, doc, query, getDoc, getDocs, setDoc } from "firebase/firestore"

import ImageUpload from './components/ImageUpload'

export default function Home() {
  const [inventory, setInventory] = useState([]) // state to store the list of inventory items
  const [open, setOpen] = useState(false) // state to control the visibility of some UI element
  const [itemName, setItemName] = useState('') // state to store the name of an item
  const [classifiedItems, setClassifiedItems] = useState([]) // state to store classified items

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  // adding an item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  // removing an item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  // updating an item
  const updateItem = async (item, itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { itemName } = docSnap.data();
      await setDoc(docRef, { itemName: itemName })
    }
    await updateInventory()
  }

  // to initialize inventory
  useEffect(() => {
    updateInventory()
  }, [])

  // UI AND RENDERING
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            > Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      > Add New Item
      </Button>
      <Box
        border="1px solid #000">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Typography
            variant="h2"
            color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto">
          {
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgColor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h4" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name)
                    }}
                  >Add</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name)
                    }}
                  >Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
        <ImageUpload setClassifiedItems={setClassifiedItems} />
        {classifiedItems.length > 0 && (
          <Box
            width="800px"
            height="200px"
            bgcolor="#FFF8DC"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={5}
            mt={2}
          >
            <Typography variant="h5" color="#333">
              Classified Items
            </Typography>
            <Stack direction="column" spacing={1}>
              {classifiedItems.map((item, index) => (
                <Typography key={index} variant="body1" color="#333">
                  {item.className}: {Math.round(item.probability * 100)}%
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}


