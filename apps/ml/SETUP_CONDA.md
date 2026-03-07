# Setting up ML Environment with Conda

Using Conda is the **best approach** for this project because it handles the complex C++ dependencies for libraries like NumPy and Pandas automatically, which were causing errors with your standard Python installation.

## Step 1: Install Miniconda (via Terminal)
You can install Miniconda (a lightweight version of Anaconda) directly from your terminal using `winget`.

1.  Run this command in your terminal:
    ```powershell
    winget install Anaconda.Miniconda3
    ```
2.  **Restart your terminal** (close and reopen VS Code) after installation to make the `conda` command available.

## Step 2: Create the Environment
Once `conda` is working, run these commands one by one in the `apps/ml` directory:

1.  **Create a Python 3.10 environment** (This version is most compatible with ML libraries):
    ```powershell
    conda create -n pharmacy-ml python=3.10 -y
    ```

2.  **Activate the environment**:
    ```powershell
    conda activate pharmacy-ml
    ```

3.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

## Step 3: Run the Real ML Service
Now you can run the actual ML service instead of the mock one:

```powershell
uvicorn app.main:app --reload --port 8000
```
