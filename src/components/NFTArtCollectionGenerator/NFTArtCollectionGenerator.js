import CreativeEngine from '@cesdk/cesdk-js/cesdk-engine.umd.js'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { DOGS } from "./data"
import styles from './NFTArtCollectionGenerator.module.css'
import React, { useEffect, useRef, useState } from 'react'

export default function NFTArtCollectionGenerator() {
  const engineRef = useRef(null)

  const [tradingCardImages, setTradingCardImages] = useState(new Array(DOGS.length).fill(null))
  const [initialized, setInitialized] = useState(false)

  // initializing CE.SDK on first rendering
  useEffect(() => {
    const config = {
      page: {
        title: {
          show: false
        }
      }
    }

    CreativeEngine
        .init(config)
        .then(async (instance) => {
          // importing the CE.SDK scene
          await instance.scene.loadFromURL(
              `${window.location.protocol + "//" + window.location.host}/assets/cesdk-nft-doggo.scene`
          )

          engineRef.current = instance

          setInitialized(true)
        })

    return function shutdownCreativeEngine() {
      engineRef?.current?.dispose()
    }
  }, [])

  async function generateTradingCards() {
    const cesdk = engineRef?.current

    if (initialized && cesdk) {
      // setting the image loading state to true
      // to each image
      setTradingCardImages((oldImages) => [
        ...oldImages.map((image) => ({ ...image, isLoading: true }))
      ])

      const newTradingCardImages = []

      // iterating over each data entry to generate
      // its trading card with CE.SDK
      for (const dog of DOGS) {
        // giving each variable defined in the CE.SDK scene
        // a value based on the dog data
        cesdk.variable.setString('name', dog.name)
        cesdk.variable.setString('date', dog.date)
        cesdk.variable.setString('chain', dog.chain)
        cesdk.variable.setString('drool', dog.drool)
        cesdk.variable.setString('courage', dog.courage)

        // retrieving the background block
        const backgroundBlock = cesdk.block.findByType('page')[0]
        if (backgroundBlock) {
          // setting the background to a random color
          cesdk.block.setBackgroundColorRGBA(
              backgroundBlock,
              Math.random(), // r (from 0 to 1)
              Math.random(), // g (from 0 to 1)
              Math.random(), // b (from 0 to 1)
              1.0 // alpha (from 0 to 1)
          )
        }

        const blob = await cesdk.block.export(
            cesdk.block.findByType('scene')[0],
            'image/jpeg'
        )

        newTradingCardImages.push({
          isLoading: false,
          src: URL.createObjectURL(blob)
        })
      }

      // setting the new trading card images
      setTradingCardImages(newTradingCardImages)
    }
  }

  // generating the trading card images for the first time
  // when CE.SDK is initialized
  useEffect(() => {
    if (engineRef && initialized) {
      generateTradingCards()
    }
  }, [engineRef, initialized])

  return (
      <div className="flex flex-col items-center">
        <div>
          <h3 className={`h4 ${styles.headline}`}>
            NFT Trading Card Collection Generator
          </h3>
        </div>
        <div>
          <button
              className={styles.button}
              onClick={() => {
                generateTradingCards()
              }}>
            Generate
          </button>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.imageWrapper}>
            {tradingCardImages.map((image, i) => {
              return (
                  <div style={{ width: 160, height: 210, position: 'relative', backgroundColor: "white" }} key={i}>
                    {
                        image?.src &&
                        <img
                            alt=""
                            src={image?.src}
                            style={{
                              opacity: image?.isLoading ? 0.5 : 1,
                              transition: 'opacity .5s',
                              transitionTimingFunction: 'ease-in-out',
                              objectFit: 'contain'
                            }}
                        />
                    }
                    {image?.isLoading && <LoadingSpinner />}
                  </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}