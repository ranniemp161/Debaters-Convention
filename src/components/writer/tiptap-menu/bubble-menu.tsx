import { type BubbleMenuPluginProps, BubbleMenuPlugin } from '@tiptap/extension-bubble-menu'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type BubbleMenuProps = Optional<Omit<Optional<BubbleMenuPluginProps, 'pluginKey'>, 'element'>, 'editor'> &
    React.HTMLAttributes<HTMLDivElement> & { editor: Editor; tippyOptions?: any }

export const BubbleMenu = React.forwardRef<HTMLDivElement, BubbleMenuProps>(
    (
        {
            pluginKey = 'bubbleMenu',
            editor,
            updateDelay,
            resizeDelay,
            appendTo,
            shouldShow = null,
            getReferencedVirtualElement,
            options,
            children,
            tippyOptions,
            ...restProps
        },
        ref,
    ) => {
        const menuEl = useRef(document.createElement('div'))

        if (typeof ref === 'function') {
            ref(menuEl.current)
        } else if (ref) {
            ref.current = menuEl.current
        }

        const pluginEditor = editor

        const bubbleMenuPluginProps: Omit<BubbleMenuPluginProps, 'editor' | 'element'> = {
            updateDelay,
            resizeDelay,
            appendTo,
            pluginKey,
            shouldShow,
            getReferencedVirtualElement,

            options,
        }

        const bubbleMenuPluginPropsRef = useRef(bubbleMenuPluginProps)
        bubbleMenuPluginPropsRef.current = bubbleMenuPluginProps

        useEffect(() => {
            if (pluginEditor?.isDestroyed) {
                return
            }

            if (!pluginEditor) {
                console.warn('BubbleMenu component does not have editor prop.')
                return
            }

            const bubbleMenuElement = menuEl.current
            bubbleMenuElement.style.visibility = 'hidden'
            bubbleMenuElement.style.position = 'absolute'

            const plugin = BubbleMenuPlugin({
                ...bubbleMenuPluginPropsRef.current,
                editor: pluginEditor,
                element: bubbleMenuElement,
            })

            pluginEditor.registerPlugin(plugin)

            const createdPluginKey = bubbleMenuPluginPropsRef.current.pluginKey

            return () => {
                pluginEditor.unregisterPlugin(createdPluginKey)
                // Request animation frame to avoid removing node that might be used by plugin logic in same tick
                window.requestAnimationFrame(() => {
                    if (bubbleMenuElement.parentNode) {
                        bubbleMenuElement.parentNode.removeChild(bubbleMenuElement)
                    }
                })
            }
        }, [pluginEditor])

        return createPortal(<div {...restProps}>{children}</div>, menuEl.current)
    },
)
