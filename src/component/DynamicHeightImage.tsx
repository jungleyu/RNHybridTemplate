import React, { useState, useEffect } from 'react';
import { Image, Dimensions } from 'react-native';

export default function DynamicHeightImage({ imageUrl }: { imageUrl: string }) {
    const [imageHeight, setImageHeight] = useState(0);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        // 如果 imageUrl 有效，获取其真实尺寸
        if (imageUrl) {
            Image.getSize(
                imageUrl,
                (originalWidth, originalHeight) => {
                    // 根据屏幕宽度计算等比例的高度
                    const calculatedHeight = (originalHeight / originalWidth) * screenWidth;
                    setImageHeight(calculatedHeight);
                },
                (error) => {
                    console.error('获取图片尺寸失败: ', error);
                    // 可以设置一个默认高度或做其他错误处理
                    setImageHeight(0);
                }
            );
        }
    }, [imageUrl, screenWidth]); // 当图片地址或屏幕宽度变化时重新计算

    return (
        <Image
            source={{ uri: imageUrl }}
            style={{
                width: screenWidth,
                height: imageHeight, // 👈 使用计算出的动态高度
                resizeMode: 'cover',
            }}
        />
    );
};