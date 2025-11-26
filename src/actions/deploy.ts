'use server'

export async function triggerDeployment() {
    const deployHookUrl = process.env.DEPLOY_HOOK_URL

    if (!deployHookUrl) {
        throw new Error('Deploy Hook URL is not configured')
    }

    const response = await fetch(deployHookUrl, {
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error('Failed to trigger deployment')
    }

    return { success: true }
}
