import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import { FloatingMenuPlugin } from '@tiptap/extension-floating-menu'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type FloatingMenuProps = Omit<Optional<FloatingMenuPluginProps, 'pluginKey'>, 'element' | 'editor'> & {
    editor: Editor
    options?: FloatingMenuPluginProps['options']
    tippyOptions?: any
} & React.HTMLAttributes<HTMLDivElement>

export const FloatingMenu = React.forwardRef<HTMLDivElement, FloatingMenuProps>(
    ({ pluginKey = 'floatingMenu', editor, appendTo, shouldShow = null, options, tippyOptions, children, ...restProps }, ref) => {
        const menuEl = useRef(document.createElement('div'))

        if (typeof ref === 'function') {
            ref(menuEl.current)
        } else if (ref) {
            ref.current = menuEl.current
        }

        useEffect(() => {
            const floatingMenuElement = menuEl.current

            floatingMenuElement.style.visibility = 'hidden'
            floatingMenuElement.style.position = 'absolute'

            if (editor?.isDestroyed) {
                return
            }

            const attachToEditor = editor

            if (!attachToEditor) {
                console.warn(
                    'FloatingMenu component does not have editor prop.',
                )
                return
            }

            const plugin = FloatingMenuPlugin({
                editor: attachToEditor,
                element: floatingMenuElement,
                pluginKey,
                appendTo,
                shouldShow,

                options,
            })

            attachToEditor.registerPlugin(plugin)

            return () => {
                attachToEditor.unregisterPlugin(pluginKey)
                window.requestAnimationFrame(() => {
                    if (floatingMenuElement.parentNode) {
                        floatingMenuElement.parentNode.removeChild(floatingMenuElement)
                    }
                })
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [editor, appendTo, pluginKey, shouldShow, options, tippyOptions])

        return createPortal(<div {...restProps}>{children}</div>, menuEl.current)
    },
)
