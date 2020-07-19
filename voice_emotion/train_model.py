from cnn_model import emotion_model
from build_train import build_train_data

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from matplotlib import pyplot as plt


# Set hyperparameters
learn_rate = 0.001
epc = 25
bt_size = 32

# Define optimizer and loss function

optimizer = optim.Adam(emotion_model.parameters(), lr=learn_rate)
lossfun = nn.CrossEntropyLoss()

# Lets define a dataloader for train dataset

X, y = build_train_data()

X = torch.from_numpy(X).double()
y = torch.from_numpy(y).double()

train_data = torch.utils.data.TensorDataset(X, y)
train_loader = torch.utils.data.DataLoader(
    train_data, batch_size=bt_size, shuffle=True)

X = X.float()


# Put model in train mode

def train(model, train_loader, epochs):
    model.train()
    epoch_loss = []
    epoch_accu = []

    for epoch in range(epochs):

        # iterate through train dataset

        for batch_idx, (data, target) in enumerate(train_loader):
            data = data.float()

            # get output
            output = model(data)

            # compute loss function
            loss = lossfun(output, torch.max(target, 1)[1])

            # backward pass
            optimizer.zero_grad()
            loss.backward()

            # run optimizer
            optimizer.step()

            # bookkeeping
            accuracy = (output.argmax(-1) ==
                        torch.max(target, 1)[1]).float().mean()
            epoch_loss.append(loss.item())
            epoch_accu.append(accuracy.item())

            # if batch_idx % 500 == 0:
            #     print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}\tAccuracy: {:.2f}'.format(
            #         epoch+1, batch_idx * len(data), len(train_loader.dataset),
            #         100. * batch_idx / len(train_loader), loss.item(), accuracy.item()))

        print('Train Epoch: {}\tAverage Loss: {:.6f}\tAverage Accuracy: {:.2f}'.format(
            epoch+1, sum(epoch_loss)/len(epoch_loss), sum(epoch_accu)/len(epoch_accu)))

    # save network
    torch.save(model.state_dict(), "emotion_cnn.pt")

    return epoch_loss, epoch_accu


epoch_loss, epoch_accu = train(emotion_model, train_loader, epochs=epc)
